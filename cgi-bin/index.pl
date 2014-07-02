#!"C:\xampp\perl\bin\perl.exe"

use strict;
use warnings;
use CGI;
use lib "./lib";
use Users;
use Data::Dump qw(dump);
use JSON::PP;

my $q = CGI->new();
my $method = lc($ENV{'REQUEST_METHOD'});
my $path = $ENV{'REQUEST_URI'};
my $data;

if (lc($method) eq 'post') {
    my $str = $q->param('POSTDATA');
    $data = JSON::PP->new->utf8->decode($str);
} elsif(lc($method) eq 'get') {
    my @params = $q->param;
    foreach my $k (@params) {
        $data->{$k} = $q->param($k);
    }
} else {
    print $q->header;
    print "method $method not supported";
    exit 0;
}
no strict "refs";
&$method($path, $data);
use strict "refs";

sub get {
    
    
}

sub post {
    my $path = shift;
    my $data = shift;
    print $q->header;
    print "Inside POST function";
    my $users = Users->new();
    my $return = $users->get_users($data);
    print "code : ".$return->{'code'};
    print "content: ".$return->{'content'};
}